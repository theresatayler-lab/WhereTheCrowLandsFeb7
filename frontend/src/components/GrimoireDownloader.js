// GrimoireDownloader.js - Download entire grimoire as PDF
import React, { useState, useRef } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import html2pdf from 'html2pdf.js';

// Main Grimoire Downloader component
export const GrimoireDownloader = ({ spells, userName }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const contentRef = useRef(null);

  const downloadGrimoire = async () => {
    if (!spells || spells.length === 0) {
      toast.error('No spells to download');
      console.log('No spells available:', spells);
      return;
    }

    console.log('Starting PDF generation with', spells.length, 'spells');
    console.log('First spell:', spells[0]);

    setIsGenerating(true);
    setShowPreview(true); // Show the content so html2canvas can capture it
    
    // Wait for render
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const element = contentRef.current;
      if (!element) {
        toast.error('Content not ready');
        console.error('contentRef is null');
        return;
      }

      console.log('Element found, generating PDF...');
      console.log('Element innerHTML length:', element.innerHTML.length);

      const opt = {
        margin: 10,
        filename: `my-grimoire-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.9 },
        html2canvas: { 
          scale: 1.5,
          useCORS: true,
          allowTaint: true,
          logging: true,
          backgroundColor: '#D8CBB3'
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' 
        }
      };

      await html2pdf().set(opt).from(element).save();
      
      console.log('PDF saved successfully');
      toast.success('Grimoire downloaded!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF: ' + error.message);
    } finally {
      setIsGenerating(false);
      setShowPreview(false);
    }
  };

  // Render spell content
  const renderSpellContent = (spell, index) => {
    const spellData = spell.spell_data || {};
    const assetPlan = spell.asset_plan || {};
    const generatedAssets = assetPlan.generated_assets || {};
    
    return (
      <div key={index} style={{ 
        backgroundColor: '#D8CBB3', 
        padding: '30px',
        marginBottom: '20px',
        pageBreakAfter: 'always'
      }}>
        {/* Title */}
        <h2 style={{ 
          fontFamily: 'Georgia, serif', 
          fontSize: '24px', 
          color: '#6B2D2D',
          textAlign: 'center',
          marginBottom: '15px'
        }}>
          {spellData.title || 'Untitled Spell'}
        </h2>

        {/* Archetype */}
        <p style={{ 
          fontFamily: 'Arial, sans-serif', 
          fontSize: '12px', 
          color: '#8B7355',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          Crafted by {spell.archetype_name || 'Unknown'}
        </p>

        {/* Introduction */}
        {spellData.introduction && (
          <p style={{ 
            fontFamily: 'Georgia, serif', 
            fontSize: '14px', 
            fontStyle: 'italic',
            color: '#4A3728',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {spellData.introduction}
          </p>
        )}

        {/* Materials */}
        {spellData.materials && spellData.materials.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ 
              fontFamily: 'Georgia, serif', 
              fontSize: '16px', 
              color: '#6B2D2D',
              marginBottom: '10px'
            }}>
              Materials Needed
            </h3>
            <ul style={{ paddingLeft: '20px' }}>
              {spellData.materials.map((mat, i) => (
                <li key={i} style={{ 
                  fontFamily: 'Arial, sans-serif', 
                  fontSize: '12px',
                  marginBottom: '5px',
                  color: '#2D1810'
                }}>
                  {mat.name}{mat.note ? ` — ${mat.note}` : ''}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Steps */}
        {(spellData.the_working?.steps || spellData.steps) && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ 
              fontFamily: 'Georgia, serif', 
              fontSize: '16px', 
              color: '#6B2D2D',
              marginBottom: '10px'
            }}>
              The Working
            </h3>
            {(spellData.the_working?.steps || spellData.steps).map((step, i) => (
              <div key={i} style={{ marginBottom: '15px' }}>
                <p style={{ 
                  fontFamily: 'Georgia, serif', 
                  fontSize: '13px', 
                  color: '#6B2D2D',
                  fontWeight: 'bold'
                }}>
                  {i + 1}. {step.title}
                </p>
                <p style={{ 
                  fontFamily: 'Arial, sans-serif', 
                  fontSize: '12px',
                  color: '#2D1810',
                  marginLeft: '15px'
                }}>
                  {step.instruction}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Incantation */}
        {spellData.spoken_words?.main_incantation && (
          <div style={{ 
            padding: '15px',
            backgroundColor: 'rgba(107, 45, 45, 0.1)',
            borderLeft: '3px solid #6B2D2D',
            marginBottom: '20px'
          }}>
            <h3 style={{ 
              fontFamily: 'Georgia, serif', 
              fontSize: '14px', 
              color: '#6B2D2D',
              marginBottom: '10px'
            }}>
              Words of Power
            </h3>
            <p style={{ 
              fontFamily: 'Georgia, serif', 
              fontSize: '14px',
              fontStyle: 'italic',
              color: '#4A3728',
              textAlign: 'center'
            }}>
              &ldquo;{spellData.spoken_words.main_incantation}&rdquo;
            </p>
          </div>
        )}

        {/* Closing */}
        {spellData.closing_message && (
          <p style={{ 
            fontFamily: 'Georgia, serif', 
            fontSize: '12px', 
            fontStyle: 'italic',
            color: '#4A3728',
            textAlign: 'center',
            marginTop: '20px'
          }}>
            {spellData.closing_message}
          </p>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '30px', color: '#8B7355' }}>
          ☽ ✦ ☾
        </div>
      </div>
    );
  };

  return (
    <>
      <button
        onClick={downloadGrimoire}
        disabled={isGenerating || !spells || spells.length === 0}
        className="px-4 py-2 bg-gold/20 text-gold border border-gold/40 rounded-sm font-montserrat tracking-widest uppercase text-xs hover:bg-gold/30 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        data-testid="download-grimoire-btn"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating PDF...
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Download Entire Grimoire ({spells?.length || 0})
          </>
        )}
      </button>

      {/* Hidden content for PDF generation - only shown during generation */}
      {showPreview && (
        <div 
          ref={contentRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '210mm',
            minHeight: '297mm',
            backgroundColor: '#D8CBB3',
            zIndex: 9999,
            overflow: 'auto'
          }}
        >
          {/* Cover Page */}
          <div style={{ 
            minHeight: '297mm',
            backgroundColor: '#1a1a2e', 
            color: '#D4A84B',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '60px 40px',
            textAlign: 'center',
            pageBreakAfter: 'always'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '40px' }}>✧</div>
            <h1 style={{ 
              fontFamily: 'Georgia, serif', 
              fontSize: '36px', 
              marginBottom: '20px',
              textTransform: 'uppercase',
              letterSpacing: '4px'
            }}>
              My Grimoire
            </h1>
            <div style={{ 
              width: '200px', 
              height: '2px', 
              background: 'linear-gradient(90deg, transparent, #D4A84B, transparent)',
              margin: '20px 0'
            }} />
            <p style={{ 
              fontFamily: 'Georgia, serif', 
              fontSize: '18px', 
              color: '#E8DCC4',
              fontStyle: 'italic'
            }}>
              A Collection of {spells?.length || 0} Sacred Workings
            </p>
            <div style={{ marginTop: '60px', fontSize: '24px', color: '#8B7355' }}>
              ☽ ✦ ☾
            </div>
          </div>

          {/* Table of Contents */}
          <div style={{ 
            minHeight: '297mm',
            backgroundColor: '#D8CBB3', 
            padding: '60px 40px',
            pageBreakAfter: 'always'
          }}>
            <h2 style={{ 
              fontFamily: 'Georgia, serif', 
              fontSize: '24px', 
              color: '#6B2D2D',
              textAlign: 'center',
              marginBottom: '30px',
              borderBottom: '2px solid #8B7355',
              paddingBottom: '15px'
            }}>
              Table of Contents
            </h2>
            {spells?.map((spell, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px dotted #8B7355'
              }}>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: '14px', color: '#2D1810' }}>
                  {index + 1}. {spell.spell_data?.title || 'Untitled'}
                </span>
                <span style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#6B2D2D' }}>
                  {spell.archetype_name || ''}
                </span>
              </div>
            ))}
          </div>

          {/* Spell Pages */}
          {spells?.map((spell, index) => renderSpellContent(spell, index))}
        </div>
      )}
    </>
  );
};

export default GrimoireDownloader;
