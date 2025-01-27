import { User } from '../../src/model/UserModel';


test("Create User", async () => {
    const user = await User.create({ name: "John Doe", password: "securepassword" });

    expect(user).toBeTruthy();
    expect(user._id).toBeDefined();
    expect(user.name).toBe("John Doe");
    expect(user.password).not.toBe("securepassword");
    expect(user.createdAt).toBeDefined();

    const isMatch = await user.isCorrectPassword("securepassword");
    expect(isMatch).toBe(true);
});

test("Find User by name", async () => {
    const user = await User.create({ name: "John Doe", password: "securepassword" });
    const foundUser = await User.findOne({ name: "John Doe" });
    expect(foundUser).toBeTruthy();
    expect(foundUser?.name).toBe(user.name);
    expect(foundUser?.password).toBe(user.password);
});

test("Delete User", async () => {
    const user = await User.create({ name: "John Doe", password: "securepassword" });
    await User.findByIdAndDelete(user._id);
    const deletedUser = await User.findById(user._id);
    expect(deletedUser).toBeNull();
});

