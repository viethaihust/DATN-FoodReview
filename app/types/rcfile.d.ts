import { RcFile as OriRcFile } from "antd/es/upload";

declare module "antd/es/upload/interface" {
  export interface RcFile extends OriRcFile {
    readonly lastModifiedDate: Date;
    thumbUrl?: string;
  }
}
