import { SecureContext } from 'tls';

export interface Repository {
  hostname: string;
  secureContext: SecureContext;
}

export interface AddDto {
  hostname: string;
  secureContext: SecureContext;
}

export interface IsUniqueDto {
  hostname: string;
}

export interface RemoveDto {
  hostname: string;
}

export interface FindDto {
  hostname: string;
}
