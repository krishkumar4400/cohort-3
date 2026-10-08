[
  {
    $match: {
      restaurant: new ObjectId("672917c30002000000068605"),
      status: "delivered",
      createdAt: {
        $gte: new Date("Tue, 01 Sep 2026 00:00:00 GMT"),
      },
    },
  },
  {
    $group: {
      _id: {
        $dateToString: {
          format: "%Y-%m-%d",
          date: "$createdAt",
        },
      },
      totalRevenue: {
        $sum: "$totalAmount",
      },
    },
  },
  {
    $sort: {
      _id: 1,
    },
  },
  {
    $project: {
      date: "$_id",
      revenue: "$totalRevenue",
      _id: 0,
    },
  },
];

[
  {
    $match: {
      status: "delivered",
      createdAt: {
        $gte: datetime(2026, 9, 30, 14, 57, 29, (tzinfo = timezone.utc)),
      },
    },
  },
  {
    $group: {
      _id: "$restaurant",
      totalRevenue: {
        $sum: "$totalAmount",
      },
    },
  },
  {
    $limit: 5,
  },
  {
    $sort: {
      totalRevenue: -1,
    },
  },
];
