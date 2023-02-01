import { DynamicModule, Module } from "@nestjs/common"
import { UtherCoreModule } from "./uther-core.module"

import { UtherAsyncOptions, UtherOptions } from "../interfaces/uther/uther-option.interface"

@Module({})
export class UtherModule {
  public static forRoot(options?: UtherOptions): DynamicModule {
    return {
      module: UtherModule,
      imports: [
        /** Modules **/
        UtherCoreModule.forRoot(options!),
      ],
    };
  }

  public static forRootAsync(options: UtherAsyncOptions): DynamicModule {
    return {
      module: UtherModule,
      imports: [
        /** Modules **/
        UtherCoreModule.forRootAsync(options),
      ],
    };
  }
}