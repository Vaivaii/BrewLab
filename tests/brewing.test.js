import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRecipe } from '../src/brewing/calculator.js';
test('B75 baseline for 15g medium roast',()=>{const r=calculateRecipe({dose:15,device:'b75',roast:'medium',goal:'balanced',grinder:'c3s'});assert.equal(r.water,240);assert.equal(r.ratio,16);assert.equal(r.temp,93);assert.equal(r.clicks,16);});
test('dose scales water',()=>{assert.equal(calculateRecipe({dose:20,device:'b75'}).water,320);});
test('light roast raises temperature',()=>{assert.equal(calculateRecipe({dose:15,device:'b75',roast:'light'}).temp,95);});
test('other grinder avoids false click precision',()=>{assert.equal(calculateRecipe({grinder:'other'}).clicks,null);});
test('moka pot stays in its own recipe range',()=>{const r=calculateRecipe({dose:15,device:'moka'});assert.equal(r.temp,90);assert.equal(r.ratio,10);});