import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { NutritionData } from '../types/NutritionData';

/**
 * Generate and download a PDF report from the nutrition data
 * @param nutritionData The nutrition data to include in the report
 * @param imagePreview Base64 image preview to include in the report
 * @param reportRef Reference to the HTML element that contains the report content
 */
export const generatePDFReport = async (
  nutritionData: NutritionData,
  imagePreview: string | null,
  reportRef: React.RefObject<HTMLDivElement>
): Promise<void> => {
  try {
    // Show toast or loading indicator
    console.log('Generating PDF report...');
    
    if (!reportRef.current) {
      console.error('Report element not found');
      return;
    }

    // We need to make sure images are fully loaded before rendering to canvas
    const imgPromises: Promise<void>[] = [];
    
    // Get all images in the report element and wait for them to load
    const images = reportRef.current.querySelectorAll('img');
    images.forEach((img) => {
      if (!img.complete) {
        const promise = new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => {
            console.error('Error loading image for PDF');
            resolve(); // Resolve anyway to continue with PDF generation
          };
        });
        imgPromises.push(promise);
      }
    });
    
    // Wait for all images to load before proceeding
    await Promise.all(imgPromises);
    
    // Create a new PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Render the report element to a canvas with appropriate settings
    const canvas = await html2canvas(reportRef.current, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Allow loading cross-origin images
      logging: false,
      allowTaint: true, // Allow tainted canvas
      backgroundColor: '#ffffff',
      foreignObjectRendering: false, // Sometimes setting this to false helps with rendering issues
      onclone: (clonedDoc) => {
        // Make the cloned document and its elements visible for rendering
        const clonedElement = clonedDoc.querySelector('.nutrition-report');
        if (clonedElement) {
          (clonedElement as HTMLElement).style.visibility = 'visible';
          (clonedElement as HTMLElement).style.position = 'static';
          (clonedElement as HTMLElement).style.width = '800px';
          (clonedElement as HTMLElement).style.height = 'auto';
          (clonedElement as HTMLElement).style.top = '0';
          (clonedElement as HTMLElement).style.left = '0';
        }
      }
    });

    // Get the image data from the canvas
    const imgData = canvas.toDataURL('image/png');

    // Add the image to the PDF
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // Add image to first page
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    // If the content is taller than a page, add multiple pages
    if (pdfHeight > pdf.internal.pageSize.getHeight()) {
      let remainingHeight = pdfHeight;
      let pageHeight = pdf.internal.pageSize.getHeight();
      let currentPage = 1;

      while (remainingHeight > 0) {
        remainingHeight -= pageHeight;
        if (remainingHeight > 0) {
          pdf.addPage();
          currentPage++;
          pdf.addImage(
            imgData,
            'PNG',
            0,
            -(pageHeight * currentPage) + pageHeight,
            pdfWidth,
            pdfHeight
          );
        }
      }
    }

    // Add a footer with the date
    const today = new Date().toLocaleDateString();
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`NutriScore Report - Generated on ${today}`, pdfWidth / 2, pdf.internal.pageSize.getHeight() - 10, { align: 'center' });

    // Download the PDF
    pdf.save(`NutriScore_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    
    console.log('PDF report generated successfully');
    
    // Show success message to user (could be replaced with a toast notification)
    setTimeout(() => {
      alert('PDF report downloaded successfully!');
    }, 500);
    
  } catch (error) {
    console.error('Error generating PDF report:', error);
    alert("There was an error generating your PDF report. Please try again.");
  }
};