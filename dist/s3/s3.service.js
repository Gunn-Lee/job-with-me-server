"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const config_1 = require("@nestjs/config");
let S3Service = class S3Service {
    configService;
    s3Client;
    constructor(configService) {
        this.configService = configService;
        const region = this.configService.get('AWS_REGION');
        const accessKeyId = this.configService.get('AWS_ACCESS_KEY');
        const secretAccessKey = this.configService.get('AWS_SECRET_KEY');
        if (!region || !accessKeyId || !secretAccessKey) {
            throw new Error('Missing required AWS configuration');
        }
        this.s3Client = new client_s3_1.S3Client({
            region,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
    }
    async uploadFile(file, key) {
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this.configService.get('AWS_S3_BUCKET'),
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read',
        });
        await this.s3Client.send(command);
        return `https://${this.configService.get('AWS_S3_BUCKET')}.s3.amazonaws.com/${key}`;
    }
};
exports.S3Service = S3Service;
exports.S3Service = S3Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], S3Service);
//# sourceMappingURL=s3.service.js.map