# Axon Open Admin

Axon Framework is a great CQRS/Event-Sourcing library. However, it comes with little to no built-in support for managing your tracking tokens or event store. 
This project aims to fix that problems and provides an administration interface without requiring additional deployments. Just add the Spring Boot starter and it works out of the box!

## How to install

Add the following dependency to your maven project:

```
<dependency>
    <groupId>com.insidion</groupId>
    <artifactId>axon-open-admin</artifactId>
    <version>${axon-open-admin.version}</version>
</dependency>
```

When your application now boots you can access the administration interface at `/(your-context-path)/axon-admin/`. Enjoy!

## Future plans
I plan on expanding the administration interface with improved controls, oversight and additional views as well as the ability to search your event store. 
