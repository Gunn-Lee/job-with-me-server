import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // Check if user exists and is active
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT tokens
    const payload = { 
      sub: user.id, 
      email: user.email,
      role: user.role 
    };
    
    const accessToken = this.jwtService.sign(payload);
    
    // Generate refresh token with longer expiry
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '7d' }
    );

    // Store refresh token in database
    await this.prisma.user.update({
      where: { id: user.id },
      data: { 
        refreshToken,
        lastLogin: new Date(),
      },
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      // Verify the refresh token
      const payload = this.jwtService.verify(refreshToken);
      const userId = payload.sub;

      // Find user with this refresh token
      const user = await this.prisma.user.findFirst({
        where: { 
          id: userId,
          refreshToken,
        },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new access token
      const newPayload = { 
        sub: user.id, 
        email: user.email,
        role: user.role 
      };
      
      return {
        access_token: this.jwtService.sign(newPayload),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: number) {
    // Clear refresh token in database
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    return { success: true };
  }
}