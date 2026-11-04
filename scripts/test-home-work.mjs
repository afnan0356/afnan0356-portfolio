import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';
import vm from 'node:vm';
const source = ts.transpileModule(readFileSync(new URL('../src/lib/home-work.ts', import.meta.url), 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;
const exports = {};
vm.runInNewContext(source, { exports });
const select = exports.selectHomeWork;
// Synthetic unit-test records only; never added to production collections.
const record = (id, featured=true) => ({ id, data: { featured } });
test('Nyayota remains a single primary feature; other featured work is secondary',()=>{const data=[record('other'),record('nyayota'),record('not-featured',false)];const result=select(data);assert.equal(result.primary.id,'nyayota');assert.equal(result.secondary.length,1);assert.equal(result.secondary[0].id,'other')});
test('Fallback feature heading can use the actual selected project, never hardcoded Nyayota',()=>{const result=select([record('unfeatured',false),record('another')]);assert.equal(result.primary.id,'another');assert.equal(result.secondary.length,0)});
test('Empty archive returns no primary or secondary features',()=>{const result=select([]);assert.equal(result.primary,undefined);assert.equal(result.secondary.length,0)});
