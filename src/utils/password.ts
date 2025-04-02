import bcrypt from "bcryptjs";

export const saltAndHashPassword = async (password: string) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
}; 