package com.progetto_soasec_dolza_pesci.config;

import org.keycloak.adapters.springsecurity.KeycloakConfiguration;
import org.keycloak.adapters.springsecurity.authentication.KeycloakAuthenticationProvider;
import org.keycloak.adapters.springsecurity.config.KeycloakWebSecurityConfigurerAdapter;
import org.keycloak.adapters.springsecurity.management.HttpSessionManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.authority.mapping.SimpleAuthorityMapper;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.web.authentication.session.RegisterSessionAuthenticationStrategy;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;

@KeycloakConfiguration
public class SecurityConfig extends KeycloakWebSecurityConfigurerAdapter {

    /**
     * Ha lo scopo di registrare Keycloak nel gestore di autenticazione di Spring Security.
     * Inoltre, dato che i nomi dei ruoli vengono gestiti da Spring Security attraverso
     * un formato del tipo ROLE_Name, viene gestita all’interno del metodo l’aggiunta
     * automatica del prefisso ROLE_ ai ruoli presenti su Keycloak.
     */
    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) {
        SimpleAuthorityMapper grantedAuthorityMapper = new SimpleAuthorityMapper();
        grantedAuthorityMapper.setPrefix("ROLE_");

        KeycloakAuthenticationProvider keycloakAuthenticationProvider = keycloakAuthenticationProvider();
        keycloakAuthenticationProvider.setGrantedAuthoritiesMapper(grantedAuthorityMapper);
        auth.authenticationProvider(keycloakAuthenticationProvider);
    }

    /**
     * L’applicazione che stiamo costruendo viene definita da Keycloak come un’applicazione
     * pubblica con interazione utente.
     * Viene impiegata la strategia i autenticazione RegisterSessionAuthenticationStrategy,
     * la quale registra la sessione utente in seguito all’autenticazione.
     */
    @Bean
    @Override
    protected SessionAuthenticationStrategy sessionAuthenticationStrategy() {
        return new RegisterSessionAuthenticationStrategy(new SessionRegistryImpl());
    }

    /**
     * Definisce un HttpSessionManager  solo se manca.
     *
     * Questo è necessario perchè da  Spring Boot 2.1.0, spring.main.allow-bean-definition-overriding
     * è disabilitata di default
     */
    @Bean
    @Override
    @ConditionalOnMissingBean(HttpSessionManager.class)
    protected HttpSessionManager httpSessionManager() {
        return new HttpSessionManager();
    }

    /**
     * Definire i vincoli di sicurezza della nostra applicazione.
     */
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        super.configure(http);
        http
            .authorizeRequests()
            .antMatchers("/ingegneri").hasRole("Ingegnere")
            .antMatchers("/manager").hasRole("Manager")
            .anyRequest().permitAll();
    }
}
