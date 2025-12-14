/* eslint-disable @typescript-eslint/no-explicit-any */
import { 
  Controller, Get, Patch, Delete, Body, Query, Param, UseGuards, Request, ParseIntPipe 
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

// DTOs
import { UpdateUserDto } from '../auth/dtos/update-user.dto';
import { ChangePasswordDto } from '../auth/dtos/change-password.dto';

// Use Cases
import { GetProfileUseCase } from './use-cases/get-profile.usecase';
import { UpdateUserUseCase } from './use-cases/update-user.usecase';
import { ChangePasswordUseCase } from './use-cases/change-password.usecase';
import { DeleteAccountUseCase } from './use-cases/delete-account.usecase';
import { AdminManageUsersUseCase } from './use-cases/admin-manage-users.usecase';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard) // Proteção Global do Controller (exceto onde for Public)
export class UsersController {
  constructor(
    private readonly getProfile: GetProfileUseCase,
    private readonly updateUser: UpdateUserUseCase,
    private readonly changePassword: ChangePasswordUseCase,
    private readonly deleteAccount: DeleteAccountUseCase,
    private readonly adminManager: AdminManageUsersUseCase,
  ) {}

  // --- PERFIL DO USUÁRIO LOGADO ---

  @Get('me')
  async getMe(@Request() req: any) {
    return this.getProfile.execute(req.user.userId);
  }

  @Patch('me')
  async updateMe(@Request() req: any, @Body() body: UpdateUserDto) {
    return this.updateUser.execute(req.user.userId, body);
  }

  @Patch('change-password')
  async changePass(@Request() req: any, @Body() body: ChangePasswordDto) {
    return this.changePassword.execute(req.user.userId, body);
  }

  @Delete('me')
  async deleteMe(@Request() req: any) {
    return this.deleteAccount.execute(req.user.userId);
  }

  // --- ÁREA ADMINISTRATIVA (Backoffice) ---

  @Roles('ADMIN') // Apenas ADMIN acessa
  @Get()
  async listAll(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
  ) {
    return this.adminManager.findAll(page, limit);
  }

  @Roles('ADMIN')
  @Patch(':id/status')
  async toggleStatus(
    @Param('id', ParseIntPipe) id: number, 
    @Body('isActive') isActive: boolean
  ) {
    return this.adminManager.toggleStatus(id, isActive);
  }
}