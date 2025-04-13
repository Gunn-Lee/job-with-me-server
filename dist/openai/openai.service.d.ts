import { ConfigService } from '@nestjs/config';
export declare class OpenAiService {
    private configService;
    private openai;
    constructor(configService: ConfigService);
    summarizeResume(resumeText: string): Promise<string>;
}
