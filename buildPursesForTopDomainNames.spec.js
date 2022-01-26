var chai = require('chai');

const { run } = require('./buildPursesForTopDomainNames');

var expect = chai.expect;

describe("buildPursesForTopDomainNames", () => {
  it("should works", () => {
		const rawContent = `1,netflix.com
2,1net23aa.fr
3,azertyuioopqsdfghjklwxcvbndfghj.fr
4,coca-cola.com
5,1net23aa.fr
6,coca-cola.fr`;
		const rawTldContent = `foo-bar
1abc
foo
coca-cola`;
		
		const {
			validDomains,
			invalids,
			duplicates
		} = run(rawContent, rawTldContent);

		expect(Object.keys(validDomains)).to.eql(['netflix', '1net23aa', 'cocacola', 'foobar', '1abc', 'foo']);
		expect(invalids).to.eql({'azertyuioopqsdfghjklwxcvbndfghj': 'length' })
		expect(duplicates).to.eql({ '1net23aa': ["1net23aa.fr"], 'cocacola': ['coca-cola.fr', 'coca-cola']});
	});
});
