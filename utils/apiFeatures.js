class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const queryObj = { ...this.queryString };
    const excludeField = ["page", "sort", "limit", "search", "fields"];
    excludeField.forEach((el) => {
      delete queryObj[el];
    });

    // 2) advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      let queryStr = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(queryStr);
    } else {
      this.query = this.query.sort("createdAt");
    }
    return this;
  }
  limitFields() {
    if (this.queryString.fields) {
      let field = this.queryString.field.split(",").join(" ");
      this.query = this.query.select(field);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }
  pagination() {
    const page = this.queryString.page || 1;
    const limit = this.queryString.limit || 10;
    const skip = (page - 1) * limit;
    //   let totalProduct;
    // //   if (this.query.page) {
    //     totalProduct = await Product.find({ sellerId }).countDocuments();
    //     if (skip >= totalProduct) {
    //       return next(new AppError("page does not exist ", 401));
    //     }
    //   }

    this.query = this.query.limit(limit).skip(skip);
    return this;
  }
  search() {
    if (this.queryString.search) {
      this.query = this.query.find({
        $text: {
          $search: this.queryString.search,
        },
      });
    }
    return this;
  }
}

export default ApiFeatures;
