module.exports = class UserDto {
    static toDto(user){
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    }
}