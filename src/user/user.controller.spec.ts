import {Test, TestingModule} from "@nestjs/testing";

import {UserController} from "./user.controller";
import {mockUser} from "./user.mocks";
import {UserService} from "./user.service";

describe("UserController", () => {
  let controller: UserController;
  let userService: UserService;

  const mockUserService = {
    findOneUser: jest.fn().mockResolvedValue(mockUser),
    deleteUserAccount: jest.fn().mockResolvedValue(mockUser)
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useValue: mockUserService
        }
      ],
      controllers: [UserController]
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("userService should be defined", () => {
    expect(userService).toBeDefined();
  });

  describe("findOne", () => {
    it("should get a user", async () => {
      const result = await controller.findOne(mockUser.id, mockUser);

      expect(userService.findOneUser).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });

  describe("delete", () => {
    it("should delete a user", async () => {
      const result = await controller.delete(mockUser.id, mockUser);

      expect(userService.deleteUserAccount).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });
});
