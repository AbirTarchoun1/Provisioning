namespace Backend.Dtos
{
    public class ProductsStatisticsDto
    {

        public int ProductsCount { get; set; }
        public int ActiveProductsCount { get; set; }
        public int InactiveProductsCount { get; set; }


        public int Month { get; set; }
        public int Year { get; set; }
        public int Count { get; set; }
    }
}
