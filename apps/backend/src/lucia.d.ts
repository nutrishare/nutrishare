/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./lucia").Auth;
  type DatabaseUserAttributes = {
    createdAt: Date;
    updatedAt: Date;
    username: string;
    email: string;
  };
}
