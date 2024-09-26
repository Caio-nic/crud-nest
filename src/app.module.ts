import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './products/product.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', // Tipo de banco de dados
      host: 'localhost', // Endereço do banco
      port: 3306, // Porta do MySQL
      username: 'root', // Usuário do MySQL
      password: 'senha', // Senha do usuário
      database: 'nome_do_banco', // Nome do banco de dados
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Entidades que o TypeORM usará
      synchronize: true, // Sincronizar automaticamente as entidades com o banco (somente em desenvolvimento)
    }),
    ProductModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
