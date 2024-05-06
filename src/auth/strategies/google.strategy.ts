import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {UserRole} from "@prisma/client";
import {PassportStrategy} from "@nestjs/passport";
import {Profile, Strategy} from "passport-google-oauth20";
import {UserService} from "../../user/user.service";
import {UserEntity} from "../../user/user.dto";
import {AuthService} from "../auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    protected configService: ConfigService
  ) {
    super({
      clientID: configService.get("GOOGLE_CLIENT_ID"),
      clientSecret: configService.get("GOOGLE_CLIENT_SECRET"),
      callbackURL: configService.get("GOOGLE_CALLBACK_URL"),
      scope: ["email", "profile"]
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: Profile): Promise<UserEntity> {
    const {emails, displayName, provider, id: providerId} = profile;

    const email = emails[0].value;
    const user = await this.userService.findOneUser({email});

    // If user does not exist, create a new user account
    if (!user) {
      return await this.userService.createUserAccount({
        name: displayName,
        email,
        role: UserRole.USER,
        account: {
          provider,
          providerAccountId: providerId
        }
      });
    }

    // If the user exists, but logs in with a different provider account, create a new account
    const providerAccountExists = await this.authService.checkIfProviderAccountExists(user.id, profile);

    if (!providerAccountExists) {
      await this.userService.createSSOProviderAccount({
        provider,
        providerAccountId: providerId,
        userId: user.id
      });
    }

    return user;
  }
}
