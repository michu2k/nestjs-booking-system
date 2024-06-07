import {IsInt} from "class-validator";

export class DeleteEntityResponse {
  @IsInt()
  id: number;
}
