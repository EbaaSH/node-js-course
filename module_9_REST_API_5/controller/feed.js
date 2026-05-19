exports.getPosts = (req,res,next) => {
    res.status(200).json({
        posts: [
            {
                _id: '1',
                title: 'First Post',
                content: 'This is the first post!',
                imageUrl:'./images/download.jpg',
                creator: {name: 'EBAA'},
                createdAt: new Date()
    
            }
        ]
    });
};

exports.createPost = (req,res,next) => {
    title = req.body.title;
    content = req.body.content;
    // Create post in db
    res.status(201).json({
        message: 'Post created successfully!',
        post: {
            _id: new Date().toISOString(),
             title: title,
              content: content,
              creator: {name: 'EBAA'},
              createdAt: new Date()
        }
    });
};