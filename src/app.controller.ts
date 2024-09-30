import { Controller, Get, Post, Render, Body, HttpRedirectResponse, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Account } from './Account';
import { OpenAccountDto } from './OpenAccount.dto';
import { Response } from 'express';

@Controller()
export class AppController {
  #accounts: Account[] = [
    {
      id: '1111-2222',
      balance: 15000,
      owner: 'Admin',
      createdAt: new Date(2020, 1, 1)
    },
    {
      id: '1234-5678',
      balance: 35500,
      owner: 'User1',
      createdAt: new Date(2022, 3, 15)
    },
    {
      id: '8765-4321',
      balance: 43200,
      owner: 'User2',
      createdAt: new Date(2023, 6, 7)
    }
  ]




  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }

  @Get('openAccount')
  @Render('openAccountForm')
  openAccountform(){
    return {
      data: {},
      errors: []
    }
  }

  
  @Post('openAccount')
  openAccount(
    @Body() openAccountDto: OpenAccountDto,
    @Res() response: Response){
    let errors = [];

    if(!openAccountDto.id || !openAccountDto.balance || !openAccountDto.owner){
      errors.push('Minden mezőt kötelező kitölteni!');
    }

    if (! /^\d\d\d\d-\d\d\d\d$/.test(openAccountDto.id)) {
      errors.push('A számlaszám 0000-0000 formátumú legyen!')
    } else {
      const acc = this.#accounts.find(acc => acc.id == openAccountDto.id)
      if (acc != undefined) {
        errors.push('Ez a számlaszám már létezik!')
      }
    }

    let balance = parseInt(openAccountDto.balance);
    if (balance < 0) {
      errors.push('Az egyenleg nem lehet negatív');
    } 

    if (errors.length > 0) {
      response.render('openAccountForm', {
        data: openAccountDto,
        errors
      })
      return;
    }


      
    const newAccount: Account = {
      id: openAccountDto.id,
      owner: openAccountDto.owner,
      balance:parseInt(openAccountDto.balance),
      createdAt: new Date(),
    }

    this.#accounts.push(newAccount);
    response.redirect('/openAccountSuccess');
  }



  @Get('openAccountSuccess')
  openAccountSuccess(){
    return 'Sikeres létrehozás!' 
  }

}



