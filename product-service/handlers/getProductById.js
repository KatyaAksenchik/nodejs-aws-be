import productList from "../data/productList.json";

export const getProductsById = async (event) => {
    console.log("event", event);

    return {
        statusCode: 200,
        body: JSON.stringify(productList)
    };
};
