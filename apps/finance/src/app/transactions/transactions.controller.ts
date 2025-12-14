import { Body, Controller, Delete, Get, Headers, Param, Post, Query } from '@nestjs/common';
import { CreateTransactionUseCase } from './use-cases/create-transaction.usecase';
import { ListTransactionsUseCase } from './use-cases/list-transactions.usecase';
import { DeleteTransactionUseCase } from './use-cases/delete-transaction.usecase';
import { GetBalanceUseCase } from './use-cases/get-balance.usecase';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { FilterTransactionDto } from './dtos/filter-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly createUseCase: CreateTransactionUseCase,
    private readonly listUseCase: ListTransactionsUseCase,
    private readonly deleteUseCase: DeleteTransactionUseCase,
    private readonly balanceUseCase: GetBalanceUseCase,
  ) {}

  @Post()
  create(@Headers('x-user-id') userId: string, @Body() dto: CreateTransactionDto) {
    return this.createUseCase.execute(Number(userId), dto);
  }

  @Get()
  findAll(@Headers('x-user-id') userId: string, @Query() filters: FilterTransactionDto) {
    return this.listUseCase.execute(Number(userId), filters);
  }

  @Delete(':id')
  delete(@Headers('x-user-id') userId: string, @Param('id') id: string) {
    return this.deleteUseCase.execute(Number(userId), Number(id));
  }

  @Get('balance')
  getBalance(
    @Headers('x-user-id') userId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return this.balanceUseCase.execute(Number(userId), startDate, endDate);
  }
}