import chai from 'chai';
import { describe, xdescribe, it, beforeEach } from 'mocha';
import { TableRepository } from '../libs';
import { TableDto } from '../dtos/libs';

describe('TableRepository', () => {
  let table: TableRepository;

  let add: TableDto.AddDto = {
    source: {
      hostname: 'www.facebook.com',
      path: '/hello',
    },
    target: {
      hostname: 'www.facebook.com',
      path: '/',
      redirect: false,
      ws: false,
    },
  };

  beforeEach(() => {
    table = new TableRepository();
    table.add(add);
  });

  describe('add()', () => {
    it('shoud add the host', () => {
      chai.expect(table.repository).length(1);
      chai.expect(table.repository[0].subscriber).length(1);
      chai.expect(table.repository[0].subscriber[0]).to.deep.equal(add.target);
    });
  });

  describe('find()', () => {
    it('shoud find and return the host', () => {
      chai
        .expect(table.find({ hostname: add.source.hostname, path: add.source.path }))
        .to.deep.equal(table.repository[0]);

      chai
        .expect(table.find({ hostname: add.source.hostname }))
        .to.deep.equal(table.repository[0]);

      chai.expect(table.find({ hostname: add.source.hostname, path: '/test' })).to.null;
    });
  });

  describe('remove()', () => {
    it('shoud find and remove the host', () => {
      chai.expect(
        table.remove({
          source: {
            hostname: add.source.hostname,
            path: add.source.path,
          },
          target: {
            hostname: add.target.hostname,
            path: add.target.path,
          },
        })
      ).to.true;

      chai.expect(table.repository[0].subscriber).to.length(0);
    });
  });

  describe('exists()', () => {
    it('shoud return `True` if source exists', () => {
      chai.expect(table.exists({ hostname: add.source.hostname })).to.true;
    });

    it("shoud return `False` if source doesn't exists", () => {
      chai.expect(table.exists({ hostname: 'something' })).to.false;
    });
  });

  describe('isUnique()', () => {
    it("shoud retrun `True` if target doesn't exist", () => {
      chai.expect(
        table.isUnique({
          source: {
            hostname: add.source.hostname,
            path: '/something/new',
          },
          target: {
            hostname: add.target.hostname,
            path: add.target.path,
          },
        })
      ).to.true;

      chai.expect(
        table.isUnique({
          source: {
            hostname: 'somethingnew.com',
            path: add.source.path,
          },
          target: {
            hostname: add.target.hostname,
            path: add.target.path,
          },
        })
      ).to.true;

      chai.expect(
        table.isUnique({
          source: {
            hostname: add.source.hostname,
            path: add.source.path,
          },
          target: {
            hostname: add.target.hostname,
            path: '/something/new',
          },
        })
      ).to.true;

      chai.expect(
        table.isUnique({
          source: {
            hostname: add.source.hostname,
            path: add.source.path,
          },
          target: {
            hostname: 'somethingnew.com',
            path: add.target.path,
          },
        })
      ).to.true;
    });

    it('shoud return `False` if target exists', () => {
      chai.expect(
        table.isUnique({
          source: {
            hostname: add.source.hostname,
            path: add.source.path,
          },
          target: {
            hostname: add.target.hostname,
            path: add.target.path,
          },
        })
      ).to.false;
    });
  });
});
