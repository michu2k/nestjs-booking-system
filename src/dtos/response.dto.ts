import {IsInt} from "class-validator";

export class DeleteEntityResponse {
  @IsInt()
  id: number;

  constructor(partial: Partial<DeleteEntityResponse>) {
    Object.assign(this, partial);
  }
}
