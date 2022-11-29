const { Schema, model} = require('mongoose')
 
//Coleccion - tabla

const UserSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email:{
        type:String,
        required: [true, 'Email is required'],
        unique: true
    },
    password:{
        type:String,
        required: [true, 'Password is required']
    },
    img:{
        type:String 
    },
    role:{
        type:String,
        required: true,
        default: 'USER_ROLE',
        emun: ['ADMIN_ROLE', 'USER_ROLE']
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

UserSchema.methods.toJSON = function() {
    const { __v, password, _id, ...user} = this.toObject();
    user._uid = _id;
    return user;
}

module.exports = model( 'User', UserSchema);