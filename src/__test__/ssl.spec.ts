import { SslDto } from '../dtos/libs';
import { SslRepository } from '../libs';
import tls from 'tls';
import chai from 'chai';

describe('SSLRepository', () => {
  let ssl: SslRepository;

  let add: SslDto.AddDto = {
    hostname: 'facebook.com',
    secureContext: tls.createSecureContext(),
  };

  beforeEach(() => {
    ssl = new SslRepository();
    ssl.add(add);
  });

  describe('add()', () => {
    it('shoud add ssl', () => {
      chai.expect(ssl.repository).length(1);
      chai.expect(ssl.repository).to.deep.equal([add]);
    });

    it('shoud pass ', () => {
      chai.expect(12).to.be.greaterThan(10);
    });
  });

  describe('find()', () => {
    it('shoud find and return the ssl', () => {
      chai.expect(ssl.find({ hostname: add.hostname })).to.deep.equal(add);
    });

    it("shoud return null if hostname doesn't exists", () => {
      chai.expect(ssl.find({ hostname: 'randomhost' })).to.be.null;
    });
  });

  describe('remove()', () => {
    it('shoud remove ssl', () => {
      chai.expect(ssl.remove({ hostname: add.hostname })).to.deep.equal(add);

      chai.expect(ssl.repository).length(0);
    });

    it("shoud return false if hostname doesn't exists", () => {
      chai.expect(ssl.remove({ hostname: 'somehost' })).to.be.undefined;
    });
  });
});
