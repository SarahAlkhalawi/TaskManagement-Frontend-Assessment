import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoginDto, RegisterDto, AuthResponseDto, UserDto } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/api/auth`;
  private currentUserSubject = new BehaviorSubject<UserDto | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    const token = this.getToken();
    const user = this.getStoredUser();
    
    if (token && user && !this.isTokenExpired(token)) {
      this.currentUserSubject.next(user);
    } else {
      this.clearAuthData();
    }
  }

  register(registerDto: RegisterDto): Observable<AuthResponseDto> {
    return this.http.post<AuthResponseDto>(`${this.apiUrl}/register`, registerDto)
      .pipe(
        tap(response => {
          console.log('Register response:', response);
          this.handleAuthResponse(response);
        })
      );
  }

  login(loginDto: LoginDto): Observable<AuthResponseDto> {
    return this.http.post<AuthResponseDto>(`${this.apiUrl}/login`, loginDto)
      .pipe(
        tap(response => {
          console.log('Login response:', response);
          this.handleAuthResponse(response);
        })
      );
  }

  private handleAuthResponse(response: any): void {
    console.log('Handling auth response:', response);
    
    if (response && response.token) {
      if (response.user && response.expiresAt) {
        this.setAuthData(response as AuthResponseDto);
      } 

      else if (response.user) {
        const authResponse: AuthResponseDto = {
          token: response.token,
          user: response.user,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) 
        };
        this.setAuthData(authResponse);
      }

      else {

        const user: UserDto = {
          id: response.id || 'unknown',
          username: response.username || 'user',
          email: response.email || '',
          createdAt: new Date()
        };
        
        const authResponse: AuthResponseDto = {
          token: response.token,
          user: user,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        };
        this.setAuthData(authResponse);
      }
    } else {
      console.error('Invalid auth response structure:', response);
      throw new Error('Invalid response from server');
    }
  }

  logout(): void {
    console.log('Logging out...');
    this.clearAuthData();
    this.router.navigate(['/auth/login']).then(() => {
      console.log('Redirected to login page');
    });
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): UserDto | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired(token);
  }

  private setAuthData(authResponse: AuthResponseDto): void {
    try {
      console.log('Setting auth data:', authResponse);
      
      localStorage.setItem('token', authResponse.token);
      localStorage.setItem('user', JSON.stringify(authResponse.user));
      
      let expiryDate: Date;
      if (typeof authResponse.expiresAt === 'string') {
        expiryDate = new Date(authResponse.expiresAt);
      } else {
        expiryDate = authResponse.expiresAt;
      }
      
      localStorage.setItem('tokenExpiry', expiryDate.toISOString());
      this.currentUserSubject.next(authResponse.user);
      
      console.log('Auth data saved successfully');
    } catch (error) {
      console.error('Error saving auth data:', error);
    }
  }

  private getStoredUser(): UserDto | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const expiry = localStorage.getItem('tokenExpiry');
      if (!expiry) return true;
      
      return new Date() > new Date(expiry);
    } catch (error) {
      console.error('Error checking token expiry:', error);
      return true;
    }
  }
}