import { ModuleMetadata, Provider, Type } from "@nestjs/common";

export interface UtherOptions {
  enviroment?: any
}

export interface UtherOptionsFactory {
  createMailerOptions(): Promise<UtherOptions> | UtherOptions;
}


export interface UtherAsyncOptions extends Pick<ModuleMetadata, "imports"> {
  inject?: any[];
  useClass?: Type<UtherOptionsFactory>;
  useExisting?: Type<UtherOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<UtherOptions> | UtherOptions;
  extraProviders?: Provider[];
}
