const express = require('express')
const {addBrand, deleteBrand, getBrand, getBrands, updateBrand } = require('../handlers/brand-handler');
const { model } = require('mongoose');
const router = express.Router()

// POST - Create brand
router.post('', async (req, res) => {
   try {
     const model = req.body;
     const result = await addBrand(model);
     res.status(201).send(result);
   } catch (error) {
     res.status(500).send({ error: error.message });
   }
 });
 
 // GET - Get single brand
 router.get('/:id', async (req, res) => {
   try {
     const id = req.params.id;
     const brand = await getBrand(id);
     res.send(brand);
   } catch (error) {
     res.status(400).send({ error: error.message });
   }
 });
 
 // PUT - Update brand
 router.put('/:id', async (req, res) => {
   try {
     const id = req.params.id;
     await updateBrand(id, req.body);
     res.send({ message: "Brand updated successfully" });
   } catch (error) {
     res.status(400).send({ error: error.message });
   }
 });
 
 // DELETE - Remove brand
 router.delete('/:id', async (req, res) => {
   try {
     const id = req.params.id;
     await deleteBrand(id);
     res.send({ message: "Brand deleted successfully" });
   } catch (error) {
     res.status(400).send({ error: error.message });
   }
 });
 
 // GET - All brands
 router.get('', async (req, res) => {
   try {
     const brands = await getBrands();
     res.send(brands);
   } catch (error) {
     res.status(500).send({ error: "Failed to fetch brands" });
   }
 });
 
 module.exports = router