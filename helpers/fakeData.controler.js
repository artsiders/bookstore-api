const Meditation = require("../models/meditation.model");
const User = require("../models/user.model");
const { faker } = require("@faker-js/faker");
const dayjs = require("dayjs");
const Subscription = require("../models/subscription.model");

module.exports.fakeMeditaton = (_, res) => {
    const format = (date) => dayjs(date).format("YYYY-MM-DD")
    try {
        for (let i = 0; i < 10; i++) {
            let meditation = new Meditation({
                ref: faker.name.firstName(),
                content: faker.lorem.paragraph(),
                date: format(faker.date.between('2022-01-01', '2023-01-01')),
            })
            meditation.save()
        }
    } catch (error) {
        res.status(400).json({
            error: true,
            message: "erreur lors de la génération des données",
            data: []
        })
        return;
    }
    res.status(200).json({
        error: false,
        message: "donnée généré avec succès !",
        data: []
    })
}
module.exports.fakeUser = (_, res) => {
    try {
        for (let i = 0; i < 10; i++) {
            let user = new User({
                fullName: faker.name.fullName(),
                profil: faker.image.avatar(),
                phone: faker.phone.number('+2376########'),
            })
            user.save()
        }
    } catch (error) {
        res.status(400).json({
            error: true,
            message: "erreur lors de la génération des données",
            data: []
        })
        return;
    }
    res.status(200).json({
        error: false,
        message: "donnée généré avec succès !",
        data: []
    })
}

module.exports.fakeSubscription = (_, res) => {
    const format = (date) => dayjs(date).format("YYYY-MM-DD")
    try {
        for (let i = 0; i < 10; i++) {
            let meditation = new Subscription({
                userId: faker.database.mongodbObjectId(),
                startDate: format(faker.date.between('2022-01-01', '2023-01-01')),
                endDate: format(faker.date.between('2022-02-02', '2023-02-02')),
            })
            meditation.save()
        }
    } catch (error) {
        res.status(400).json({
            error: true,
            message: "erreur lors de la génération des données",
            data: []
        })
        return;
    }
    res.status(200).json({
        error: false,
        message: "donnée généré avec succès !",
        data: []
    })
}