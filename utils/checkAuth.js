import jwt from "jsonwebtoken";


export default (req, res, next) =>{

    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if(token){

        try{
            const decoded = jwt.verify(token, 'secret234');

            req.userId = decoded._id;
            // нужно выполнять ответ на запрос дальше
            next();
        }catch (err){

            return  res.status(403).json({
                message: "Ошибка доступа",
            })
        }

    } else {
        return  res.status(403).json({
            message: "Нет доступа",
        })
    }
}
