import { detachHostFromPort, digest, merge } from '../libs/url';
import chai from 'chai';

describe('Url', () => {
  describe('detachHostFromPort()', () => {
    it('shoud detach host from port', () => {
      chai
        .expect(detachHostFromPort('localhost:3000'))
        .to.deep.equal({ host: 'localhost', port: '3000' });
    });

    it('by default port must 80', () => {
      chai
        .expect(detachHostFromPort('google.com'))
        .to.deep.equal({ host: 'google.com', port: '80' });
    });
  });

  describe('digest()', () => {
    it('shoud return as valid', () => {
      chai.expect(digest({ url: 'http://localhost:3000' })).to.deep.equal({
        hostname: 'localhost:3000',
        path: '/',
        host: 'localhost',
        isValid: true,
        url: 'http://localhost:3000/',
      });

      chai.expect(digest({ url: 'http://test.com/hoem/test' })).to.deep.equal({
        hostname: 'test.com',
        path: '/hoem/test',
        host: 'test.com',
        isValid: true,
        url: 'http://test.com/hoem/test',
      });
    });

    it('shoud return as invalid', () => {
      chai.expect(digest({ url: '' }).isValid).to.false;
      chai.expect(digest({ url: 'https://' }).isValid).to.false;
      chai.expect(digest({ url: 'test.com/hoem/test' }).isValid).to.false;
      chai.expect(digest({ url: 'htt://localhost:3000' }).isValid).to.false;
    });
  });

  describe('merge()', () => {
    it('shoud merge', () => {
      chai
        .expect(
          merge({
            incomePath: 'test/to',
            sourcePath: 'test/to',
            targetPath: '/',
          })
        )
        .to.equal('/');

      chai
        .expect(
          merge({
            incomePath: 'test/to/here',
            sourcePath: 'test/to',
            targetPath: '/',
          })
        )
        .to.equal('/here');

      chai
        .expect(
          merge({
            incomePath: 'test/to/here',
            sourcePath: 'test/to',
            targetPath: '/foo',
          })
        )
        .to.equal('/foo/here');
    });

    it('shoud return empty string', () => {
      chai.expect(
        merge({
          incomePath: '/overthere',
          sourcePath: '/test',
          targetPath: '/',
        })
      ).to.empty.string;

      chai.expect(
        merge({
          incomePath: '/test',
          sourcePath: '/test/to',
          targetPath: '/',
        })
      ).to.empty.string;
    });
  });
});
