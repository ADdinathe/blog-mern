import PostModel from '../models/post.js'


export const create = async (req, res) => {
    try {

        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        })

        const post = await doc.save();

        res.json(post);

    } catch (err) {
        console.log(err);

        res.status(500).json({
            result: false,
            message: "Не удалось создать статью",
        })
    }
}

export const getAll = async (req, res) => {
    console.log(req.query)
    //TODO: если приходит category=new возвращаем новые
    //TODO: если приходит category=popular возвращаем популярные
    //TODO: если приходит tag то возвращаем все с найденным тегом


    try {
        const posts = await PostModel.find().populate('user').exec();

        res.json(posts)

    }catch (err){

        console.log(err);

        res.status(500).json({
            result: false,
            message: "Не удалось получить статьи",
        })

    }

}

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();

        const tags = posts.map((post) => post.tags).flat().slice(0,5);

        res.json(tags)

    }catch (err){

        console.log(err);

        res.status(500).json({
            result: false,
            message: "Не удалось получить теги",
        })

    }

}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndUpdate(
        {
            _id: postId,
        },
        {
            $inc: { viewsCount: 1 }
        },
{
            returnDocument: "after",
        }
        ).populate('user').then((doc, err)=>{
            if(err){
                console.log(err);

                return res.status(500).json({
                    result: false,
                    message: "Не удалось вернуть статью",
                });
            }

            if(!doc){
                return res.status(404).json({
                    result: false,
                    message: "Статья не найдена",
                })
            }

            res.json(doc);
        });

    }catch (err){
        console.log(err);
        res.status(500).json({
            result: false,
            message: "Не удалось получить статьи",
        })
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndDelete({_id: postId,})
            .then((doc, err)=>{
            if(err){
                console.log(err);

                return res.status(500).json({
                    result: false,
                    message: "Не удалось удалить статью",
                });
            }

            if(!doc){
                return res.status(404).json({
                    result: false,
                    message: "Статья не найдена",
                })
            }

            res.json({
                success: true,
            });
        });

    }catch (err){
        console.log(err);
        res.status(500).json({
            result: false,
            message: "Не удалось получить статьи",
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostModel.updateOne(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                user: req.userId,
            },
            {
                returnDocument: "after",
            }
        );

        res.json({
            success: true,
        });

    }catch (err){
        console.log(err);
        res.status(500).json({
            result: false,
            message: "Не удалось изменить статью",
        })
    }
}
