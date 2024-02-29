import moment from "moment"

const formatDate = (date) => {
    const fecha = moment(date);
    return fecha.format("DD-MM-YYYY");
}

export { formatDate }