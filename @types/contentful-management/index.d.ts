declare module 'contentful-management' {

  export function createClient(options: {
    accessToken: string,
    host?: string,
    hostUpload?: string,
    basePath?: string,
    httpAgent?: any,
    httpsAgent?: any,
    headers?: { [name: string]: string },
    proxy?: any,
    retryOnError?: boolean,
    logHandler?: (level: any, data: any) => any
  }): IManagementClient

  export interface IManagementClient {
    getSpace(id: string): Promise<any>
    getSpaces(): Promise<any>
    createSpace(data: any, organizationId?: string): Promise<any>
    createPersonalAccessToken(data: any): Promise<any>
    getCurrentUser(): Promise<any>
    getPersonalAccessTokens(): Promise<any>
    getPersonalAccessToken(data: any): Promise<any>
    getOrganizations(): Promise<any>
    rawRequest(opts: any): Promise<any>
  }

  export class SpaceCollection {
    total: number
    skip: number
    limit: number
    items: Space[]
    toPlainObject(): any[]
  }

  export class Space {
    sys: any
    name: string
    toPlainObject(): any

    delete(...params: any[]): Promise<any> 	
    update(...params: any[]): Promise<any> 	
    getEnvironment(...params: any[]): Promise<any> 	
    getEnvironments(...params: any[]): Promise<any> 	
    createEnvironment(...params: any[]): Promise<any> 	
    createEnvironmentWithId(...params: any[]): Promise<any> 	
    getContentType(...params: any[]): Promise<any> 	
    getContentTypes(...params: any[]): Promise<any> 	
    createContentType(...params: any[]): Promise<any> 	
    createContentTypeWithId(...params: any[]): Promise<any> 	
    getEntry(...params: any[]): Promise<any> 	
    getEntries(...params: any[]): Promise<any> 	
    createEntry(...params: any[]): Promise<any> 	
    createEntryWithId(...params: any[]): Promise<any> 	
    getAsset(...params: any[]): Promise<any> 	
    getAssets(...params: any[]): Promise<any> 	
    createAsset(...params: any[]): Promise<any> 	
    createAssetWithId(...params: any[]): Promise<any> 	
    getLocale(...params: any[]): Promise<any> 	
    getLocales(...params: any[]): Promise<any> 	
    createLocale(...params: any[]): Promise<any> 	
    getWebhook(...params: any[]): Promise<any> 	
    getWebhooks(...params: any[]): Promise<any> 	
    createWebhook(...params: any[]): Promise<any> 	
    createWebhookWithId(...params: any[]): Promise<any> 	
    getRole(...params: any[]): Promise<any> 	
    getRoles(...params: any[]): Promise<any> 	
    createRole(...params: any[]): Promise<any> 	
    createRoleWithId(...params: any[]): Promise<any> 	
    getSpaceMembership(...params: any[]): Promise<any> 	
    getSpaceMemberships(...params: any[]): Promise<any> 	
    createSpaceMembership(...params: any[]): Promise<any> 	
    createSpaceMembershipWithId(...params: any[]): Promise<any> 	
    getApiKey(...params: any[]): Promise<any> 	
    getApiKeys(...params: any[]): Promise<any> 	
    createApiKey(...params: any[]): Promise<any> 	
    createApiKeyWithId(...params: any[]): Promise<any> 	
    getUiExtension(...params: any[]): Promise<any> 	
    getUiExtensions(...params: any[]): Promise<any> 	
    createUiExtension(...params: any[]): Promise<any> 	
    createUiExtensionWithId(...params: any[]): Promise<any> 	
    getEntrySnapshots(...params: any[]): Promise<any> 	
    getContentTypeSnapshots(...params: any[]): Promise<any>
  }
}