import Emitter from './Emitter'
import EconomyError from './EconomyError'

/**
 * Discord Economy Super.
 */
declare module Economy {
    /**
     * Module version.
     */
    const version: '1.3.4'

    /**
     * Module documentation website.
     */
    const docs = 'https://des-docs.tk'

    /**
     * The Economy class.
     */
    class Economy extends Emitter {
        public EconomyError: EconomyError
    }

}