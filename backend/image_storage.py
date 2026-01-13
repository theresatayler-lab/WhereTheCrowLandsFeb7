"""
GridFS-based image storage for spell assets.
Solves MongoDB's 16MB document size limit by storing large base64 images separately.
"""
import logging
import base64
from typing import Optional, Dict, List
from datetime import datetime, timezone
import uuid
from motor.motor_asyncio import AsyncIOMotorGridFSBucket

logger = logging.getLogger(__name__)


class ImageStorage:
    """GridFS-based storage for spell images (header, tarot, sigil)."""
    
    def __init__(self, db):
        """Initialize with MongoDB database instance."""
        self.db = db
        self.fs = AsyncIOMotorGridFSBucket(db, bucket_name='spell_images')
    
    async def store_image(self, image_base64: str, metadata: dict) -> Optional[str]:
        """
        Store a base64 image in GridFS.
        
        Args:
            image_base64: Base64-encoded image string
            metadata: Dict with keys like spell_id, user_id, image_type
            
        Returns:
            String ID of stored image, or None if failed
        """
        if not image_base64:
            return None
            
        try:
            # Decode base64 to bytes
            image_bytes = base64.b64decode(image_base64)
            
            # Generate unique filename
            image_id = str(uuid.uuid4())
            filename = f"{metadata.get('spell_id', 'unknown')}_{metadata.get('image_type', 'image')}_{image_id}.png"
            
            # Store metadata with the file
            file_metadata = {
                'spell_id': metadata.get('spell_id'),
                'user_id': metadata.get('user_id'),
                'image_type': metadata.get('image_type'),
                'created_at': datetime.now(timezone.utc).isoformat(),
                'original_size_bytes': len(image_bytes)
            }
            
            # Upload to GridFS
            file_id = await self.fs.upload_from_stream(
                filename,
                image_bytes,
                metadata=file_metadata
            )
            
            logger.info(f"Stored image {filename} ({len(image_bytes)} bytes) -> GridFS ID: {file_id}")
            return str(file_id)
            
        except Exception as e:
            logger.error(f"Failed to store image: {e}")
            return None
    
    async def store_spell_images(self, spell_id: str, user_id: str, 
                                  image_base64: Optional[str],
                                  asset_plan: Optional[dict]) -> dict:
        """
        Store all images for a spell in GridFS.
        
        Returns dict with GridFS IDs for each image type.
        """
        image_refs = {}
        
        # Store main header image
        if image_base64:
            ref_id = await self.store_image(image_base64, {
                'spell_id': spell_id,
                'user_id': user_id,
                'image_type': 'header'
            })
            if ref_id:
                image_refs['header_image_id'] = ref_id
        
        # Store generated assets from asset_plan
        if asset_plan and 'generated_assets' in asset_plan:
            generated = asset_plan['generated_assets']
            
            # Header image (duplicate check - might be same as image_base64)
            if 'header_image' in generated and 'header_image_id' not in image_refs:
                ref_id = await self.store_image(generated['header_image'], {
                    'spell_id': spell_id,
                    'user_id': user_id,
                    'image_type': 'header'
                })
                if ref_id:
                    image_refs['header_image_id'] = ref_id
            
            # Tarot card
            if 'tarot_card_image' in generated:
                ref_id = await self.store_image(generated['tarot_card_image'], {
                    'spell_id': spell_id,
                    'user_id': user_id,
                    'image_type': 'tarot'
                })
                if ref_id:
                    image_refs['tarot_image_id'] = ref_id
            
            # Sigil
            if 'sigil' in generated:
                ref_id = await self.store_image(generated['sigil'], {
                    'spell_id': spell_id,
                    'user_id': user_id,
                    'image_type': 'sigil'
                })
                if ref_id:
                    image_refs['sigil_image_id'] = ref_id
        
        logger.info(f"Stored {len(image_refs)} images for spell {spell_id}")
        return image_refs
    
    async def get_image(self, image_id: str) -> Optional[str]:
        """
        Retrieve an image from GridFS and return as base64.
        
        Args:
            image_id: GridFS file ID (as string)
            
        Returns:
            Base64-encoded image string, or None if not found
        """
        if not image_id:
            return None
            
        try:
            from bson import ObjectId
            
            # Download from GridFS
            grid_out = await self.fs.open_download_stream(ObjectId(image_id))
            image_bytes = await grid_out.read()
            
            # Encode to base64
            image_base64 = base64.b64encode(image_bytes).decode('utf-8')
            
            logger.debug(f"Retrieved image {image_id} ({len(image_bytes)} bytes)")
            return image_base64
            
        except Exception as e:
            logger.error(f"Failed to retrieve image {image_id}: {e}")
            return None
    
    async def get_spell_images(self, image_refs: dict) -> dict:
        """
        Retrieve all images for a spell using stored GridFS references.
        
        Args:
            image_refs: Dict with keys like header_image_id, tarot_image_id, sigil_image_id
            
        Returns:
            Dict with base64 images: header_image, tarot_card_image, sigil
        """
        images = {}
        
        if image_refs.get('header_image_id'):
            img = await self.get_image(image_refs['header_image_id'])
            if img:
                images['header_image'] = img
        
        if image_refs.get('tarot_image_id'):
            img = await self.get_image(image_refs['tarot_image_id'])
            if img:
                images['tarot_card_image'] = img
        
        if image_refs.get('sigil_image_id'):
            img = await self.get_image(image_refs['sigil_image_id'])
            if img:
                images['sigil'] = img
        
        return images
    
    async def delete_spell_images(self, image_refs: dict) -> int:
        """
        Delete all images for a spell from GridFS.
        
        Returns number of images deleted.
        """
        deleted = 0
        
        from bson import ObjectId
        
        for key, image_id in image_refs.items():
            if image_id and key.endswith('_id'):
                try:
                    await self.fs.delete(ObjectId(image_id))
                    deleted += 1
                    logger.info(f"Deleted image {image_id}")
                except Exception as e:
                    logger.error(f"Failed to delete image {image_id}: {e}")
        
        return deleted


def strip_images_from_asset_plan(asset_plan: Optional[dict]) -> dict:
    """
    Remove base64 images from asset_plan before storing in MongoDB document.
    Keeps metadata and references, removes large binary data.
    """
    if not asset_plan:
        return {}
    
    # Create a copy to avoid modifying original
    cleaned = dict(asset_plan)
    
    # Remove generated_assets (contains base64 images)
    if 'generated_assets' in cleaned:
        generated = cleaned['generated_assets']
        # Keep only URLs and flags, remove base64 data
        cleaned_generated = {}
        for key, value in generated.items():
            if isinstance(value, str):
                # Keep URL references (like STATIC:url) and flags
                if value.startswith('STATIC:') or len(value) < 1000:
                    cleaned_generated[key] = value
                # Skip large base64 strings
            else:
                # Keep non-string values
                cleaned_generated[key] = value
        cleaned['generated_assets'] = cleaned_generated
    
    return cleaned
