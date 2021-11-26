module.exports = class PublisherController{
    static async createPublisher(req, res){
        res.status(200).json({message: "Publisher created successfully!"})
    }
}