import { getAllCategory_Admin } from "./FetchApi";

export const fetchCategoriesByCategoryName = async (categoryName, dispatch, setError) => {
  try {
    let responseData = await getAllCategory_Admin();
    
    if (responseData && responseData.Categories) {
      let filteredCategories;

      if (categoryName) {
        const categoryNameLower = categoryName.toLowerCase();

        // Lọc các danh mục dựa trên tên danh mục (cName) khớp với tên được cung cấp
        filteredCategories = responseData.Categories.filter(
          (item) => item.cName.toLowerCase().includes(categoryNameLower)
        );
      } else {
        // Nếu không có tên danh mục được cung cấp, trả về tất cả các danh mục
        filteredCategories = responseData.Categories;
      }

      dispatch({
        type: "fetchCategoryAndChangeState",
        payload: filteredCategories,
      });
    }
  } catch (error) {
    setError("An error occurred while fetching categories");
    console.error(error);
  }
};
