import * as fs from 'fs';
import * as path from 'path';
import { createCanvas, loadImage, registerFont, Canvas } from 'canvas';
import { Request, Response } from 'express';

interface FakeChatMessage {
  role: "user" | "contact";
  content: string;
  timestamp?: string;
  status?: "sent" | "delivered" | "read";
  username?: string;
  avatar?: string;
}

interface StatusBarConfig {
  batteryPercentage: number;
  showBatteryPercentage: boolean;
  signalStrength: number;
  wifiStrength: number;
  carrierName: string;
  time: string;
}

interface FakeChatRequest {
  platform: "whatsapp" | "facebook" | "instagram" | "telegram" | "twitter" | "line" | "wechat";
  messages: FakeChatMessage[];
  deviceType: "iphone" | "android";
  statusBarConfig: StatusBarConfig;
  backgroundColor?: string;
  timeFormat?: "12h" | "24h";
  includeAvatar?: boolean;
}

// Platform color schemes
const platformThemes = {
  whatsapp: {
    bg: '#ECE5DD',
    userBubble: '#DCF8C6',
    contactBubble: '#FFFFFF',
    header: '#075E54',
    headerText: '#FFFFFF',
    statusbar: '#075E54',
    userText: '#000000',
    contactText: '#000000',
    timestampText: '#7D7D7D'
  },
  facebook: {
    bg: '#F1F1F1',
    userBubble: '#0084FF',
    contactBubble: '#F1F1F1',
    header: '#FFFFFF',
    headerText: '#0084FF',
    statusbar: '#FFFFFF',
    userText: '#FFFFFF',
    contactText: '#000000',
    timestampText: '#7D7D7D'
  },
  instagram: {
    bg: '#F1F1F1',
    userBubble: '#3897F0',
    contactBubble: '#EFEFEF',
    header: '#FFFFFF',
    headerText: '#000000',
    statusbar: '#FFFFFF',
    userText: '#FFFFFF',
    contactText: '#000000',
    timestampText: '#7D7D7D'
  },
  telegram: {
    bg: '#FFFFFF',
    userBubble: '#EFFDDE',
    contactBubble: '#FFFFFF',
    header: '#517DA2',
    headerText: '#FFFFFF',
    statusbar: '#517DA2',
    userText: '#000000',
    contactText: '#000000',
    timestampText: '#7D7D7D'
  },
  twitter: {
    bg: '#FFFFFF',
    userBubble: '#1DA1F2',
    contactBubble: '#F1F1F1',
    header: '#FFFFFF',
    headerText: '#1DA1F2',
    statusbar: '#FFFFFF',
    userText: '#FFFFFF',
    contactText: '#000000',
    timestampText: '#7D7D7D'
  },
  line: {
    bg: '#FFFFFF',
    userBubble: '#5ACD79',
    contactBubble: '#F1F1F1',
    header: '#00B900',
    headerText: '#FFFFFF',
    statusbar: '#00B900',
    userText: '#FFFFFF',
    contactText: '#000000',
    timestampText: '#7D7D7D'
  },
  wechat: {
    bg: '#EBEBEB',
    userBubble: '#A0E75A',
    contactBubble: '#FFFFFF',
    header: '#2C2C2C',
    headerText: '#FFFFFF',
    statusbar: '#2C2C2C',
    userText: '#000000',
    contactText: '#000000',
    timestampText: '#7D7D7D'
  }
};

// Phone dimensions for different devices
const phoneTemplates = {
  iphone: {
    width: 375,
    height: 812,
    radius: 40,
    statusBarHeight: 44,
    headerHeight: 60
  },
  android: {
    width: 360,
    height: 800,
    radius: 25,
    statusBarHeight: 30,
    headerHeight: 56
  }
};

/**
 * Generate a fake chat image based on the provided request
 */
export async function generateFakeChat(req: Request, res: Response): Promise<void> {
  try {
    const request = req.body as FakeChatRequest;
    
    // Set up the canvas based on device type
    const device = phoneTemplates[request.deviceType];
    const theme = platformThemes[request.platform];
    const canvas = createCanvas(device.width, device.height);
    const ctx = canvas.getContext('2d');
    
    // Background
    const bgColor = request.backgroundColor || theme.bg;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, device.width, device.height);
    
    // Status bar
    drawStatusBar(ctx, device, request.statusBarConfig, request.deviceType);
    
    // Header
    drawHeader(ctx, device, theme, request.platform);
    
    // Chat bubbles
    await drawChatBubbles(ctx, device, theme, request.messages, request.includeAvatar);
    
    // Convert canvas to base64 image
    const imageBase64 = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
    
    res.json({
      imageBase64
    });
  } catch (error) {
    console.error('Error generating fake chat:', error);
    res.status(500).json({ error: 'Failed to generate fake chat' });
  }
}

/**
 * Draw the status bar at the top of the screen
 */
function drawStatusBar(
  ctx: any,
  device: any,
  config: StatusBarConfig,
  deviceType: "iphone" | "android"
): void {
  ctx.fillStyle = deviceType === 'iphone' ? '#000000' : '#333333';
  ctx.fillRect(0, 0, device.width, device.statusBarHeight);
  
  // Draw time
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `14px Arial`;
  ctx.textAlign = 'center';
  let timeX = deviceType === 'iphone' ? device.width / 2 : 30;
  ctx.fillText(config.time, timeX, device.statusBarHeight / 2 + 5);
  
  // Draw signal strength
  const signalX = deviceType === 'iphone' ? 20 : device.width - 100;
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = i < config.signalStrength ? '#FFFFFF' : '#666666';
    const barHeight = 3 + (i * 2);
    ctx.fillRect(signalX + (i * 6), device.statusBarHeight / 2 - barHeight / 2, 4, barHeight);
  }
  
  // Draw WiFi strength
  const wifiX = deviceType === 'iphone' ? 60 : device.width - 60;
  // Simplistic WiFi icon
  ctx.beginPath();
  ctx.fillStyle = config.wifiStrength > 0 ? '#FFFFFF' : '#666666';
  ctx.arc(wifiX, device.statusBarHeight / 2, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.strokeStyle = config.wifiStrength > 1 ? '#FFFFFF' : '#666666';
  ctx.lineWidth = 2;
  ctx.arc(wifiX, device.statusBarHeight / 2, 8, Math.PI, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.strokeStyle = config.wifiStrength > 2 ? '#FFFFFF' : '#666666';
  ctx.arc(wifiX, device.statusBarHeight / 2, 12, Math.PI, 0);
  ctx.stroke();
  
  // Draw battery
  const batteryX = deviceType === 'iphone' ? device.width - 30 : device.width - 30;
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1;
  const batteryWidth = 20;
  const batteryHeight = 10;
  ctx.strokeRect(batteryX, device.statusBarHeight / 2 - batteryHeight / 2, batteryWidth, batteryHeight);
  ctx.fillStyle = config.batteryPercentage > 20 ? '#FFFFFF' : '#FF3B30';
  ctx.fillRect(
    batteryX + 2, 
    device.statusBarHeight / 2 - (batteryHeight - 4) / 2, 
    (batteryWidth - 4) * (config.batteryPercentage / 100), 
    batteryHeight - 4
  );
  
  // Draw battery percentage if needed
  if (config.showBatteryPercentage) {
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `10px Arial`;
    ctx.textAlign = 'right';
    ctx.fillText(`${config.batteryPercentage}%`, batteryX - 5, device.statusBarHeight / 2 + 3);
  }
  
  // Draw carrier name
  if (deviceType === 'android') {
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `12px Arial`;
    ctx.textAlign = 'right';
    ctx.fillText(config.carrierName, device.width - 120, device.statusBarHeight / 2 + 4);
  }
}

/**
 * Draw the chat app header with platform logo and name
 */
function drawHeader(
  ctx: any,
  device: any,
  theme: any,
  platform: string
): void {
  const y = device.statusBarHeight;
  
  // Header background
  ctx.fillStyle = theme.header;
  ctx.fillRect(0, y, device.width, device.headerHeight);
  
  // Platform name
  ctx.fillStyle = theme.headerText;
  ctx.font = 'bold 16px Arial';
  const platformTitle = platform.charAt(0).toUpperCase() + platform.slice(1);
  ctx.fillText(platformTitle, 60, y + device.headerHeight / 2 + 5);
  
  // Back button
  ctx.fillStyle = theme.headerText;
  ctx.beginPath();
  ctx.moveTo(20, y + device.headerHeight / 2);
  ctx.lineTo(30, y + device.headerHeight / 2 - 8);
  ctx.lineTo(30, y + device.headerHeight / 2 + 8);
  ctx.fill();
  
  // Contact avatar circle
  ctx.beginPath();
  ctx.arc(40, y + device.headerHeight / 2, 15, 0, Math.PI * 2);
  ctx.fillStyle = '#DDDDDD';
  ctx.fill();
  
  // More options
  ctx.fillStyle = theme.headerText;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(device.width - 20, y + device.headerHeight / 2 - 10 + (i * 10), 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * Draw the chat messages
 */
async function drawChatBubbles(
  ctx: any,
  device: any,
  theme: any,
  messages: FakeChatMessage[],
  includeAvatar?: boolean
): Promise<void> {
  const startY = device.statusBarHeight + device.headerHeight + 10;
  let currentY = startY;
  const bubbleMaxWidth = device.width * 0.7;
  const bubblePadding = 10;
  const bubbleRadius = 15;
  const bubbleMargin = 5;
  const avatarSize = 30;
  
  for (const message of messages) {
    const isUser = message.role === 'user';
    const bubbleColor = isUser ? theme.userBubble : theme.contactBubble;
    const textColor = isUser ? theme.userText : theme.contactText;
    
    // Calculate text dimensions
    ctx.font = '16px Arial';
    const lines = getTextLines(ctx, message.content, bubbleMaxWidth - (bubblePadding * 2));
    const textHeight = lines.length * 20; // Line height
    
    // Calculate bubble dimensions
    const bubbleHeight = textHeight + (bubblePadding * 2);
    const maxLineWidth = Math.max(...lines.map((line: string) => ctx.measureText(line).width));
    const textWidth = Math.min(maxLineWidth, bubbleMaxWidth - (bubblePadding * 2));
    const bubbleWidth = textWidth + (bubblePadding * 2);
    
    // Calculate bubble position
    const bubbleX = isUser 
      ? device.width - bubbleWidth - 10 
      : (includeAvatar ? avatarSize + 15 : 10);
    
    // Draw avatar if needed
    if (!isUser && includeAvatar) {
      ctx.beginPath();
      ctx.arc(20, currentY + bubbleHeight / 2, avatarSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = '#DDDDDD';
      ctx.fill();
    }
    
    // Draw the bubble
    ctx.fillStyle = bubbleColor;
    drawRoundedRect(ctx, bubbleX, currentY, bubbleWidth, bubbleHeight, bubbleRadius);
    
    // Draw the message content
    ctx.fillStyle = textColor;
    ctx.font = '16px Arial';
    
    lines.forEach((line: string, i: number) => {
      ctx.fillText(
        line, 
        bubbleX + bubblePadding, 
        currentY + bubblePadding + ((i + 0.7) * 20)
      );
    });
    
    // Draw the timestamp if provided
    if (message.timestamp) {
      ctx.fillStyle = theme.timestampText;
      ctx.font = '11px Arial';
      ctx.textAlign = isUser ? 'right' : 'left';
      ctx.fillText(
        message.timestamp, 
        isUser ? bubbleX + bubbleWidth - bubblePadding : bubbleX + bubblePadding, 
        currentY + bubbleHeight - 5
      );
    }
    
    // Draw the status for user messages if provided
    if (isUser && message.status) {
      ctx.fillStyle = theme.timestampText;
      ctx.font = '11px Arial';
      ctx.textAlign = 'right';
      
      let statusText = '✓';
      if (message.status === 'delivered') statusText = '✓✓';
      if (message.status === 'read') statusText = '✓✓'; // Normally blue checkmarks
      
      ctx.fillText(
        statusText, 
        bubbleX + bubbleWidth - bubblePadding - (message.timestamp ? ctx.measureText(message.timestamp).width + 5 : 0), 
        currentY + bubbleHeight - 5
      );
    }
    
    // Reset text align
    ctx.textAlign = 'left';
    
    // Update Y position for next bubble
    currentY += bubbleHeight + bubbleMargin;
  }
}

/**
 * Helper function to draw a rounded rectangle
 */
function drawRoundedRect(
  ctx: any,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

/**
 * Helper function to wrap text into multiple lines
 */
function getTextLines(
  ctx: any,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(`${currentLine} ${word}`).width;
    
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  
  lines.push(currentLine);
  return lines;
}