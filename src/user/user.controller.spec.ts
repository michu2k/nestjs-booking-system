import {Test, TestingModule} from "@nestjs/testing";
import {UserController} from "./user.controller";
import {UserService} from "./user.service";
import {mockUser} from "./user.mocks";

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
      const user = await controller.findOne(mockUser.id);

      expect(userService.findOneUser).toHaveBeenCalled();
      expect(user).toEqual(mockUser);
    });
  });

  describe("delete", () => {
    it("should delete a user", async () => {
      const user = await controller.delete(mockUser.id);

      expect(userService.deleteUserAccount).toHaveBeenCalled();
      expect(user).toEqual(mockUser);
    });
  });
});
