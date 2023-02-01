import { Module } from "@nestjs/common"
import { DatabaseProvider } from "./providers/connection.provider"

@Module({
  providers: [...DatabaseProvider],
  exports: [...DatabaseProvider],
})
export class DatabaseModule {}