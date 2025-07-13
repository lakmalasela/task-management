import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Signup } from './signup';
import { UserService } from '../user.service';
import { of, throwError } from 'rxjs';

describe('Signup', () => {
  let component: Signup;
  let fixture: ComponentFixture<Signup>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['register']);
    
    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule],
      declarations: [Signup],
      providers: [
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Signup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call userService.register on form submission', () => {
    userService.register.and.returnValue(of({
      username: 'testuser',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      address: 'Test Address'
    }));
    
    component.username = 'testuser';
    component.email = 'test@example.com';
    component.password = 'password';
    component.firstName = 'Test';
    component.lastName = 'User';
    component.address = 'Test Address';
    
    component.onSubmit();
    
    expect(userService.register).toHaveBeenCalledWith({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password',
      firstName: 'Test',
      lastName: 'User',
      address: 'Test Address'
    });
  });
}); 