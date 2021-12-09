const path = require("path");

// model
const { Publisher } = require(path.join(__dirname, "..", "models", "index.js"));

// field validation
const { validationResult } = require("express-validator");

module.exports = class PublisherController {
    static async deletePublisherById(req, res) {
        const id = req.params.id;

        const publisher = await PublisherController.findPublisherById(id);

        if (!publisher) {
            return res.status(422).json({ message: `Publisher not found!` });
        }

        try {
            await Publisher.destroy({ where: { id: id } });
            return res.status(200).json({
                message: `Publisher '${id}' deleted successfully!`,
            });
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ error: "There was an error at the server!" });
        }
    }

    static async editPublisher(req, res) {
        // validations

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        if (!Object.keys(req.body).length)
            return res
                .status(400)
                .json({ message: "Nothing was sent to update!" });

        const id = req.params.id;
        const publisher = await PublisherController.findPublisherById(id);
        if (!publisher)
            return res.status(422).json({
                message: `Publisher not found!`,
            });

        const { name, city } = req.body;

        const editedPublisher = {
            name: name === undefined ? publisher.name : name,
            city: city === city ? publisher.city : city,
        };

        await Publisher.update(editedPublisher, { where: { id: id } });

        res.status(200).json({ message: `Publisher successfully updated!` });
    }

    static async getAllPublishers(req, res) {
        // validations

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { page, size } = req.query;
        const pageNumber = Number.parseInt(page);
        const sizeNumber = Number.parseInt(size);

        if (sizeNumber > 20)
            return res
                .status(422)
                .json({ message: "Can only get as much as 20 entries!" });

        const publishers = await Publisher.findAndCountAll({
            limit: sizeNumber,
            offset: pageNumber * sizeNumber,
        });
        return res.status(200).json({
            totalEntries: publishers['count'],
            totalPages: Math.ceil(publishers["count"] / size),
            content: publishers["rows"],
        });
    }

    static async findPublisherById(id) {
        return await Publisher.findOne({ raw: true, where: { id: id } });
    }

    static async getPublisherByID(req, res) {
        const id = req.params.id;

        const publisher = await PublisherController.findPublisherById(id);
        if (!publisher)
            return res.status(422).json({
                message: `Publisher with id '${id}' not found!`,
            });
        return res.status(200).json(publisher);
    }

    static async createPublisher(req, res) {
        // validations

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, city } = req.body;

        await Publisher.create({ name: name, city: city });

        res.status(200).json({ message: "Publisher created successfully!" });
    }
};
