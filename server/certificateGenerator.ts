import { createCanvas, registerFont } from 'canvas';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export interface CertificateData {
  userId: string;
  userName: string;
  planName: string;
  completedAt: Date;
}

export async function generateCertificate(data: CertificateData): Promise<string> {
  const canvas = createCanvas(1200, 850);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 1200, 850);

  ctx.strokeStyle = '#1e40af';
  ctx.lineWidth = 8;
  ctx.strokeRect(40, 40, 1120, 770);

  ctx.fillStyle = '#f0f9ff';
  ctx.fillRect(60, 60, 1080, 730);

  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 3;
  ctx.strokeRect(70, 70, 1060, 710);

  ctx.fillStyle = '#1e40af';
  ctx.font = 'bold 60px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Certificate of Completion', 600, 180);

  ctx.fillStyle = '#059669';
  ctx.font = 'normal 24px sans-serif';
  ctx.fillText('This certifies that', 600, 280);

  ctx.fillStyle = '#1f2937';
  ctx.font = 'bold 48px serif';
  ctx.fillText(data.userName, 600, 360);

  ctx.fillStyle = '#6b7280';
  ctx.font = 'normal 24px sans-serif';
  ctx.fillText('has successfully completed', 600, 430);

  ctx.fillStyle = '#1e40af';
  ctx.font = 'bold 36px sans-serif';
  ctx.fillText(data.planName, 600, 500);

  const completedDate = data.completedAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  ctx.fillStyle = '#6b7280';
  ctx.font = 'normal 20px sans-serif';
  ctx.fillText(`Date of Completion: ${completedDate}`, 600, 600);

  ctx.strokeStyle = '#1e40af';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(200, 680);
  ctx.lineTo(500, 680);
  ctx.stroke();

  ctx.fillStyle = '#1f2937';
  ctx.font = 'normal 18px sans-serif';
  ctx.fillText('Authorized Signature', 350, 710);

  const certificatesDir = join(process.cwd(), 'attached_assets', 'certificates');
  
  if (!existsSync(certificatesDir)) {
    await mkdir(certificatesDir, { recursive: true });
  }

  const fileName = `${data.userId}_${data.planName.replace(/\s+/g, '_')}_${Date.now()}.png`;
  const filePath = join(certificatesDir, fileName);
  
  const buffer = canvas.toBuffer('image/png');
  await writeFile(filePath, buffer);

  return `attached_assets/certificates/${fileName}`;
}
