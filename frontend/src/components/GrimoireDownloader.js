// GrimoireDownloader.js - Download entire grimoire as PDF
import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Utility to load an image and return a promise
const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    if (!src) {
      resolve(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null); // Don't fail on image errors
    img.src = src;
  });
};

// Convert base64 to image source
const getImageSrc = (base64) => {
  if (!base64) return null;
  if (base64.startsWith('data:')) return base64;
  return `data:image/png;base64,${base64}`;
};

// Main Grimoire Downloader component
export const GrimoireDownloader = ({ spells, userName }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState('');

  const downloadGrimoire = async () => {
    if (!spells || spells.length === 0) {
      toast.error('No spells to download');
      return;
    }

    setIsGenerating(true);
    setProgress('Preparing grimoire...');

    try {
      // Create PDF with A4 dimensions
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);

      // Helper to add text with word wrap
      const addWrappedText = (text, x, y, maxWidth, fontSize, fontStyle = 'normal') => {
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', fontStyle);
        const lines = pdf.splitTextToSize(text, maxWidth);
        pdf.text(lines, x, y);
        return y + (lines.length * fontSize * 0.4);
      };

      // === COVER PAGE ===
      setProgress('Creating cover page...');
      
      // Dark background for cover
      pdf.setFillColor(26, 26, 46); // Navy dark
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      
      // Title
      pdf.setTextColor(212, 168, 75); // Gold
      pdf.setFontSize(32);
      pdf.setFont('helvetica', 'bold');
      pdf.text('My Grimoire', pageWidth / 2, 100, { align: 'center' });
      
      // Decorative element
      pdf.setFontSize(24);
      pdf.text('✧', pageWidth / 2, 70, { align: 'center' });
      
      // Divider line
      pdf.setDrawColor(212, 168, 75);
      pdf.setLineWidth(0.5);
      pdf.line(60, 115, pageWidth - 60, 115);
      
      // Subtitle
      pdf.setTextColor(232, 220, 196); // Cream
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'italic');
      pdf.text(`A Collection of ${spells.length} Sacred Workings`, pageWidth / 2, 130, { align: 'center' });
      
      // Footer decoration
      pdf.setFontSize(18);
      pdf.setTextColor(139, 115, 85); // Brown
      pdf.text('☽ ✦ ☾', pageWidth / 2, 230, { align: 'center' });
      
      // Date
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Generated on ${new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`, pageWidth / 2, 270, { align: 'center' });

      // === TABLE OF CONTENTS ===
      setProgress('Creating table of contents...');
      pdf.addPage();
      
      // Parchment background
      pdf.setFillColor(216, 203, 179); // Parchment
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      
      // TOC Title
      pdf.setTextColor(107, 45, 45); // Dark red
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Table of Contents', pageWidth / 2, 30, { align: 'center' });
      
      // Divider
      pdf.setDrawColor(139, 115, 85);
      pdf.line(margin, 38, pageWidth - margin, 38);
      
      // TOC entries
      let tocY = 55;
      pdf.setFont('helvetica', 'normal');
      
      spells.forEach((spell, index) => {
        const title = spell.spell_data?.title || spell.title || 'Untitled Spell';
        const archetype = spell.archetype_name || '';
        
        pdf.setFontSize(11);
        pdf.setTextColor(45, 24, 16); // Dark brown
        
        // Entry number and title
        const entryText = `${index + 1}. ${title}`;
        pdf.text(entryText, margin, tocY);
        
        // Archetype name (right aligned)
        if (archetype) {
          pdf.setFontSize(9);
          pdf.setTextColor(107, 45, 45);
          pdf.text(archetype, pageWidth - margin, tocY, { align: 'right' });
        }
        
        // Dotted line
        pdf.setDrawColor(139, 115, 85);
        pdf.setLineDashPattern([1, 1], 0);
        const textWidth = pdf.getTextWidth(entryText);
        const archetypeWidth = archetype ? pdf.getTextWidth(archetype) : 0;
        pdf.line(margin + textWidth + 5, tocY - 1, pageWidth - margin - archetypeWidth - 5, tocY - 1);
        pdf.setLineDashPattern([], 0);
        
        tocY += 12;
        
        // Check if we need a new page for TOC
        if (tocY > pageHeight - 30 && index < spells.length - 1) {
          pdf.addPage();
          pdf.setFillColor(216, 203, 179);
          pdf.rect(0, 0, pageWidth, pageHeight, 'F');
          tocY = 30;
        }
      });

      // === SPELL PAGES ===
      for (let i = 0; i < spells.length; i++) {
        const spell = spells[i];
        const spellData = spell.spell_data || {};
        const title = spellData.title || spell.title || 'Untitled Spell';
        
        setProgress(`Processing spell ${i + 1} of ${spells.length}: ${title}`);
        
        // Add new page for each spell
        pdf.addPage();
        
        // Parchment background
        pdf.setFillColor(216, 203, 179);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
        
        let currentY = margin;
        
        // Spell Title
        pdf.setTextColor(107, 45, 45);
        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'bold');
        const titleLines = pdf.splitTextToSize(title, contentWidth);
        pdf.text(titleLines, pageWidth / 2, currentY + 10, { align: 'center' });
        currentY += 10 + (titleLines.length * 7);
        
        // Archetype attribution
        if (spell.archetype_name) {
          pdf.setFontSize(10);
          pdf.setTextColor(139, 115, 85);
          pdf.setFont('helvetica', 'italic');
          pdf.text(`Crafted by ${spell.archetype_name}`, pageWidth / 2, currentY + 5, { align: 'center' });
          currentY += 12;
        }
        
        // Divider
        pdf.setDrawColor(139, 115, 85);
        pdf.setLineWidth(0.3);
        pdf.line(margin + 20, currentY, pageWidth - margin - 20, currentY);
        currentY += 10;
        
        // Introduction
        if (spellData.introduction) {
          pdf.setFontSize(10);
          pdf.setTextColor(74, 55, 40);
          pdf.setFont('helvetica', 'italic');
          currentY = addWrappedText(spellData.introduction, margin, currentY, contentWidth, 10, 'italic');
          currentY += 8;
        }
        
        // Helper function to check page overflow and add new page
        const checkPageOverflow = (neededSpace = 30) => {
          if (currentY > pageHeight - neededSpace) {
            pdf.addPage();
            pdf.setFillColor(216, 203, 179);
            pdf.rect(0, 0, pageWidth, pageHeight, 'F');
            currentY = margin;
            return true;
          }
          return false;
        };
        
        // Materials
        const materials = spellData.materials || [];
        if (materials.length > 0) {
          checkPageOverflow(40);
          
          pdf.setFontSize(12);
          pdf.setTextColor(107, 45, 45);
          pdf.setFont('helvetica', 'bold');
          pdf.text('Materials Needed', margin, currentY);
          currentY += 8;
          
          pdf.setFontSize(10);
          pdf.setTextColor(45, 24, 16);
          pdf.setFont('helvetica', 'normal');
          
          materials.forEach(mat => {
            checkPageOverflow(15);
            const matText = mat.note ? `• ${mat.name} — ${mat.note}` : `• ${mat.name}`;
            currentY = addWrappedText(matText, margin + 5, currentY, contentWidth - 10, 10);
            currentY += 2;
          });
          currentY += 5;
        }
        
        // The Working / Steps
        const steps = spellData.the_working?.steps || spellData.steps || [];
        if (steps.length > 0) {
          checkPageOverflow(40);
          
          pdf.setFontSize(12);
          pdf.setTextColor(107, 45, 45);
          pdf.setFont('helvetica', 'bold');
          pdf.text('The Working', margin, currentY);
          currentY += 8;
          
          if (spellData.the_working?.description) {
            pdf.setFontSize(10);
            pdf.setTextColor(45, 24, 16);
            pdf.setFont('helvetica', 'normal');
            currentY = addWrappedText(spellData.the_working.description, margin, currentY, contentWidth, 10);
            currentY += 5;
          }
          
          steps.forEach((step, idx) => {
            checkPageOverflow(25);
            
            const stepNum = step.step || step.number || idx + 1;
            
            // Step title
            pdf.setFontSize(11);
            pdf.setTextColor(107, 45, 45);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`${stepNum}. ${step.title || ''}`, margin, currentY);
            currentY += 5;
            
            // Step instruction
            if (step.instruction) {
              pdf.setFontSize(10);
              pdf.setTextColor(45, 24, 16);
              pdf.setFont('helvetica', 'normal');
              currentY = addWrappedText(step.instruction, margin + 5, currentY, contentWidth - 10, 10);
            }
            
            // Spoken words for step
            if (step.spoken_words) {
              pdf.setFont('helvetica', 'italic');
              pdf.setTextColor(139, 90, 43);
              currentY = addWrappedText(`"${step.spoken_words}"`, margin + 5, currentY + 2, contentWidth - 10, 10, 'italic');
            }
            
            currentY += 5;
          });
        }
        
        // Spoken Words / Incantation
        const spokenWords = spellData.spoken_words;
        if (spokenWords) {
          checkPageOverflow(50);
          
          // Box background
          pdf.setFillColor(200, 188, 165);
          pdf.roundedRect(margin, currentY, contentWidth, 45, 2, 2, 'F');
          
          pdf.setFontSize(12);
          pdf.setTextColor(107, 45, 45);
          pdf.setFont('helvetica', 'bold');
          pdf.text('Words of Power', margin + 5, currentY + 8);
          
          currentY += 15;
          
          if (spokenWords.invocation) {
            pdf.setFontSize(9);
            pdf.setTextColor(74, 55, 40);
            pdf.setFont('helvetica', 'italic');
            pdf.text(`Opening: "${spokenWords.invocation}"`, margin + 5, currentY);
            currentY += 6;
          }
          
          if (spokenWords.main_incantation) {
            pdf.setFontSize(11);
            pdf.setTextColor(107, 45, 45);
            pdf.setFont('helvetica', 'bolditalic');
            const incLines = pdf.splitTextToSize(`"${spokenWords.main_incantation}"`, contentWidth - 10);
            pdf.text(incLines, pageWidth / 2, currentY + 3, { align: 'center' });
            currentY += incLines.length * 5 + 5;
          }
          
          if (spokenWords.closing) {
            pdf.setFontSize(9);
            pdf.setTextColor(74, 55, 40);
            pdf.setFont('helvetica', 'italic');
            pdf.text(`Closing: "${spokenWords.closing}"`, margin + 5, currentY);
          }
          
          currentY += 15;
        }
        
        // Closing message
        if (spellData.closing_message) {
          checkPageOverflow(25);
          
          pdf.setDrawColor(139, 115, 85);
          pdf.setLineWidth(0.3);
          pdf.line(margin + 20, currentY, pageWidth - margin - 20, currentY);
          currentY += 8;
          
          pdf.setFontSize(10);
          pdf.setTextColor(74, 55, 40);
          pdf.setFont('helvetica', 'italic');
          currentY = addWrappedText(spellData.closing_message, margin, currentY, contentWidth, 10, 'italic');
        }
        
        // Footer decoration
        pdf.setFontSize(14);
        pdf.setTextColor(139, 115, 85);
        pdf.text('☽ ✦ ☾', pageWidth / 2, pageHeight - 15, { align: 'center' });
        
        // Page number
        pdf.setFontSize(8);
        pdf.setTextColor(139, 115, 85);
        pdf.text(`${i + 3}`, pageWidth / 2, pageHeight - 8, { align: 'center' }); // +3 for cover and TOC
      }

      // Save the PDF
      setProgress('Saving PDF...');
      const filename = `my-grimoire-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(filename);
      
      toast.success('Grimoire downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF: ' + error.message);
    } finally {
      setIsGenerating(false);
      setProgress('');
    }
  };

  return (
    <button
      onClick={downloadGrimoire}
      disabled={isGenerating || !spells || spells.length === 0}
      className="px-4 py-2 bg-gold/20 text-gold border border-gold/40 rounded-sm font-montserrat tracking-widest uppercase text-xs hover:bg-gold/30 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      data-testid="download-grimoire-btn"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="flex flex-col items-start">
            <span>Generating PDF...</span>
            {progress && <span className="text-[10px] opacity-70">{progress}</span>}
          </span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Download Entire Grimoire ({spells?.length || 0})
        </>
      )}
    </button>
  );
};

export default GrimoireDownloader;
