import express from 'express';

const router = express.Router();

// router.get(
//   '/:id',
//   auth(
//     ENUM_USER_ROLE.SUPER_ADMIN,
//     ENUM_USER_ROLE.ADMIN,
//     ENUM_USER_ROLE.FACULTY
//   ),
//   FacultyController.getSingleFaculty
// );

// router.patch(
//   '/:id',
//   validateRequest(FacultyValidation.updateFacultyZodSchema),
//   auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
//   FacultyController.updateFaculty
// );

// router.delete(
//   '/:id',
//   auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
//   FacultyController.deleteFaculty
// );

// router.get(
//   '/',
//   auth(
//     ENUM_USER_ROLE.SUPER_ADMIN,
//     ENUM_USER_ROLE.ADMIN,
//     ENUM_USER_ROLE.FACULTY
//   ),
//   FacultyController.getAllFaculties
// );

export const SellerRoutes = router;
