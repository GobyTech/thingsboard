import { GatewayConnector } from '@home/components/widget/lib/gateway/gateway-widget.models';

export abstract class GatewayConnectorVersionProcessor<BasicConfig> {
  gatewayVersion: number;
  configVersion: number;

  protected constructor(protected gatewayVersionStr: string, protected connector: GatewayConnector<BasicConfig>) {
    this.gatewayVersion = this.parseVersion(this.gatewayVersionStr);
    this.configVersion = this.parseVersion(connector.configVersion);
  }

  getProcessedByVersion(): GatewayConnector<BasicConfig> {
    if (this.isVersionUpdateNeeded()) {
      return !this.configVersion || this.configVersion < this.gatewayVersion
        ? this.getUpgradedVersion()
        : this.getDowngradedVersion();
    }

    return this.connector;
  }

  private isVersionUpdateNeeded(): boolean {
    if (!this.gatewayVersion) {
      return false;
    }

    return this.configVersion !== this.gatewayVersion;
  }

  private parseVersion(version: string): number {
    return Number(version?.replace(/\./g, ''));
  }

  abstract getDowngradedVersion(): GatewayConnector<BasicConfig>;
  abstract getUpgradedVersion(): GatewayConnector<BasicConfig>;
}
